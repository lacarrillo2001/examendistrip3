import { useEffect, useState, useCallback } from 'react';

// Variable de entorno para la URL del API
// En desarrollo: usa REACT_APP_API_BASE o localhost
// En producción (Docker): se inyecta mediante nginx
const API_BASE = window.REACT_APP_API_BASE || process.env.REACT_APP_API_BASE || "http://localhost:8080/api";

const sectionConfig = {
  clientes: {
    title: "Clientes",
    fields: [
      { name: "nombres", label: "Nombres", type: "text", required: true, minLength: 2 },
      { name: "identificacion", label: "Identificación", type: "text", required: true, pattern: "^[0-9]{10,13}$", patternMessage: "Debe tener entre 10 y 13 dígitos" },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "telefono", label: "Teléfono", type: "text", required: true, pattern: "^[0-9]{10}$", patternMessage: "Debe tener 10 dígitos" },
    ],
    endpoint: "clientes",
  },
  planes: {
    title: "Planes",
    fields: [
      { name: "nombre", label: "Nombre", type: "text", required: true, minLength: 3 },
      { name: "tipo", label: "Tipo", type: "select", required: true, options: [
        { value: "VIDA", label: "Vida" },
        { value: "AUTO", label: "Auto" },
        { value: "SALUD", label: "Salud" }
      ]},
      { name: "primaBase", label: "Prima base", type: "number", required: true, min: 0 },
      { name: "coberturaMax", label: "Cobertura máxima", type: "number", required: true, min: 0 },
    ],
    endpoint: "planes",
  },
  polizas: {
    title: "Pólizas",
    fields: [
      { name: "numeroPoliza", label: "Número póliza", type: "text", required: true, minLength: 3 },
      { name: "fechaInicio", label: "Fecha inicio", type: "date", required: true },
      { name: "fechaFin", label: "Fecha fin", type: "date", required: true },
      { name: "primaMensual", label: "Prima mensual", type: "number", required: true, min: 0 },
      { name: "estado", label: "Estado", type: "select", required: true, options: [
        { value: "ACTIVA", label: "Activa" },
        { value: "CANCELADA", label: "Cancelada" }
      ]},
      { name: "clienteId", label: "Cliente", type: "selectRef", required: true, refEndpoint: "clientes", refLabel: "nombres" },
      { name: "planSeguroId", label: "Plan de Seguro", type: "selectRef", required: true, refEndpoint: "planes", refLabel: "nombre" },
    ],
    endpoint: "polizas",
  },
};

const defaultForm = (fields) =>
  fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {});

const defaultErrors = (fields) =>
  fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {});

function App() {
  const [active, setActive] = useState("clientes");
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(defaultForm(sectionConfig.clientes.fields));
  const [errors, setErrors] = useState(defaultErrors(sectionConfig.clientes.fields));
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Referencias para selects dinámicos
  const [clientes, setClientes] = useState([]);
  const [planes, setPlanes] = useState([]);

  const config = sectionConfig[active];

  // Cargar datos de referencia (clientes y planes)
  const loadReferenceData = useCallback(async () => {
    try {
      const [clientesRes, planesRes] = await Promise.all([
        fetch(`${API_BASE}/clientes`),
        fetch(`${API_BASE}/planes`)
      ]);
      const clientesData = await clientesRes.json();
      const planesData = await planesRes.json();
      setClientes(Array.isArray(clientesData) ? clientesData : []);
      setPlanes(Array.isArray(planesData) ? planesData : []);
    } catch (error) {
      console.error("Error cargando datos de referencia");
    }
  }, []);

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/${config.endpoint}`);
      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
      setMessage("");
    } catch (error) {
      setMessage("No se pudo conectar con el backend");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [config.endpoint]);

  useEffect(() => {
    setForm(defaultForm(config.fields));
    setErrors(defaultErrors(config.fields));
    setEditingId(null);
    loadItems();
    loadReferenceData();
  }, [active, config.fields, loadItems, loadReferenceData]);

  // Validar un campo individual
  const validateField = (field, value) => {
    if (field.required && (!value || value.toString().trim() === "")) {
      return `${field.label} es requerido`;
    }
    
    if (field.type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return "Email inválido";
      }
    }
    
    if (field.pattern && value) {
      const regex = new RegExp(field.pattern);
      if (!regex.test(value)) {
        return field.patternMessage || "Formato inválido";
      }
    }
    
    if (field.minLength && value && value.length < field.minLength) {
      return `Mínimo ${field.minLength} caracteres`;
    }
    
    if (field.type === "number" && value) {
      const num = Number(value);
      if (isNaN(num)) {
        return "Debe ser un número válido";
      }
      if (field.min !== undefined && num < field.min) {
        return `El valor mínimo es ${field.min}`;
      }
    }
    
    return "";
  };

  // Validar todo el formulario
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    config.fields.forEach(field => {
      const error = validateField(field, form[field.name]);
      newErrors[field.name] = error;
      if (error) isValid = false;
    });
    
    // Validar que fecha fin sea mayor a fecha inicio para pólizas
    if (active === "polizas" && form.fechaInicio && form.fechaFin) {
      if (new Date(form.fechaFin) <= new Date(form.fechaInicio)) {
        newErrors.fechaFin = "Fecha fin debe ser posterior a fecha inicio";
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field.name]: value });
    // Limpiar error al escribir
    if (errors[field.name]) {
      setErrors({ ...errors, [field.name]: "" });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      setMessage("Por favor corrija los errores del formulario");
      return;
    }
    
    const payload = { ...form };
    
    // Convertir campos numéricos
    if (payload.primaBase) payload.primaBase = Number(payload.primaBase);
    if (payload.coberturaMax) payload.coberturaMax = Number(payload.coberturaMax);
    if (payload.primaMensual) payload.primaMensual = Number(payload.primaMensual);
    if (payload.clienteId) payload.clienteId = Number(payload.clienteId);
    if (payload.planSeguroId) payload.planSeguroId = Number(payload.planSeguroId);

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `${API_BASE}/${config.endpoint}/${editingId}`
      : `${API_BASE}/${config.endpoint}`;

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: "Error" }));
        setMessage(error.error || "Error en la operación");
        return;
      }

      setMessage(editingId ? "Actualizado correctamente" : "Creado correctamente");
      setForm(defaultForm(config.fields));
      setErrors(defaultErrors(config.fields));
      setEditingId(null);
      loadItems();
      loadReferenceData();
    } catch (error) {
      setMessage("Error de conexión");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm(
      config.fields.reduce((acc, field) => {
        acc[field.name] = (item[field.name] !== null && item[field.name] !== undefined) 
          ? item[field.name] 
          : "";
        return acc;
      }, {})
    );
    setErrors(defaultErrors(config.fields));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Está seguro de eliminar este registro?")) return;
    
    try {
      await fetch(`${API_BASE}/${config.endpoint}/${id}`, { method: "DELETE" });
      setMessage("Eliminado correctamente");
      loadItems();
    } catch (error) {
      setMessage("Error al eliminar");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(defaultForm(config.fields));
    setErrors(defaultErrors(config.fields));
    setMessage("");
  };

  // Renderizar el input según el tipo de campo
  const renderInput = (field) => {
    const hasError = errors[field.name];
    
    if (field.type === "select") {
      return (
        <select
          name={field.name}
          value={form[field.name]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className={hasError ? "input-error" : ""}
        >
          <option value="">-- Seleccione --</option>
          {field.options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      );
    }
    
    if (field.type === "selectRef") {
      const refData = field.refEndpoint === "clientes" ? clientes : planes;
      return (
        <select
          name={field.name}
          value={form[field.name]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className={hasError ? "input-error" : ""}
        >
          <option value="">-- Seleccione --</option>
          {refData.map(item => (
            <option key={item.id} value={item.id}>
              {item.id} - {item[field.refLabel]}
            </option>
          ))}
        </select>
      );
    }
    
    return (
      <input
        name={field.name}
        type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
        value={form[field.name]}
        onChange={(e) => handleInputChange(field, e.target.value)}
        placeholder={field.label}
        className={hasError ? "input-error" : ""}
        min={field.min}
        step={field.type === "number" ? "0.01" : undefined}
      />
    );
  };

  // Obtener el nombre de referencia para mostrar en la tabla
  const getRefName = (fieldName, value) => {
    if (fieldName === "clienteId") {
      const cliente = clientes.find(c => c.id === value);
      return cliente ? cliente.nombres : value;
    }
    if (fieldName === "planSeguroId") {
      const plan = planes.find(p => p.id === value);
      return plan ? plan.nombre : value;
    }
    return value;
  };

  return (
    <div className="container">
      <header>
        <h1>Emisión de Pólizas</h1>
        <p>Administración de clientes, planes y pólizas.</p>
        <small className="api-info">API: {API_BASE}</small>
      </header>

      <nav className="tabs">
        {Object.keys(sectionConfig).map((key) => (
          <button
            key={key}
            className={active === key ? "active" : ""}
            onClick={() => setActive(key)}
          >
            {sectionConfig[key].title}
          </button>
        ))}
      </nav>

      <section className="grid">
        <form className="card" onSubmit={handleSubmit}>
          <h2>{editingId ? "Editar" : "Nuevo"} {config.title}</h2>
          {config.fields.map((field) => (
            <label key={field.name} className={errors[field.name] ? "label-error" : ""}>
              {field.label} {field.required && <span className="required">*</span>}
              {renderInput(field)}
              {errors[field.name] && <span className="field-error">{errors[field.name]}</span>}
            </label>
          ))}
          <div className="form-actions">
            <button type="submit" className="primary">
              {editingId ? "Actualizar" : "Guardar"}
            </button>
            {editingId && (
              <button type="button" onClick={handleCancel}>
                Cancelar
              </button>
            )}
          </div>
          {message && <p className={`message ${message.includes("Error") || message.includes("corrija") ? "error" : "success"}`}>{message}</p>}
        </form>

        <div className="card table-card">
          <h2>Listado de {config.title}</h2>
          {loading ? (
            <p className="loading">Cargando...</p>
          ) : items.length > 0 ? (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    {config.fields.map((field) => (
                      <th key={field.name}>{field.label}</th>
                    ))}
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      {config.fields.map((field) => (
                        <td key={field.name}>
                          {field.type === "selectRef" 
                            ? getRefName(field.name, item[field.name])
                            : item[field.name] ?? '-'}
                        </td>
                      ))}
                      <td className="actions-cell">
                        <button className="btn-edit" onClick={() => handleEdit(item)}>
                          Editar
                        </button>
                        <button className="btn-delete" onClick={() => handleDelete(item.id)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="empty">Sin registros</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default App;
