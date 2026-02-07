const { useEffect, useState } = React;

const API_BASE = window.API_BASE || "http://localhost:8080/api";

const sectionConfig = {
  clientes: {
    title: "Clientes",
    fields: [
      { name: "nombres", label: "Nombres" },
      { name: "identificacion", label: "Identificación" },
      { name: "email", label: "Email" },
      { name: "telefono", label: "Teléfono" },
    ],
    endpoint: "clientes",
  },
  planes: {
    title: "Planes",
    fields: [
      { name: "nombre", label: "Nombre" },
      { name: "tipo", label: "Tipo (VIDA/AUTO/SALUD)" },
      { name: "primaBase", label: "Prima base" },
      { name: "coberturaMax", label: "Cobertura máxima" },
    ],
    endpoint: "planes",
  },
  polizas: {
    title: "Pólizas",
    fields: [
      { name: "numeroPoliza", label: "Número póliza" },
      { name: "fechaInicio", label: "Fecha inicio (YYYY-MM-DD)" },
      { name: "fechaFin", label: "Fecha fin (YYYY-MM-DD)" },
      { name: "primaMensual", label: "Prima mensual" },
      { name: "estado", label: "Estado (ACTIVA/CANCELADA)" },
      { name: "clienteId", label: "Cliente ID" },
      { name: "planSeguroId", label: "Plan ID" },
    ],
    endpoint: "polizas",
  },
};

const defaultForm = (fields) =>
  fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {});

function App() {
  const [active, setActive] = useState("clientes");
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(defaultForm(sectionConfig[active].fields));
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const config = sectionConfig[active];

  const loadItems = async () => {
    const response = await fetch(`${API_BASE}/${config.endpoint}`);
    const data = await response.json();
    setItems(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    setForm(defaultForm(config.fields));
    setEditingId(null);
    loadItems().catch(() => setMessage("No se pudo conectar con el backend"));
  }, [active]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = { ...form };
    if (payload.primaBase) payload.primaBase = Number(payload.primaBase);
    if (payload.coberturaMax) payload.coberturaMax = Number(payload.coberturaMax);
    if (payload.primaMensual) payload.primaMensual = Number(payload.primaMensual);
    if (payload.clienteId) payload.clienteId = Number(payload.clienteId);
    if (payload.planSeguroId) payload.planSeguroId = Number(payload.planSeguroId);

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `${API_BASE}/${config.endpoint}/${editingId}`
      : `${API_BASE}/${config.endpoint}`;

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

    setMessage(editingId ? "Actualizado" : "Creado");
    setForm(defaultForm(config.fields));
    setEditingId(null);
    loadItems();
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm(
      config.fields.reduce((acc, field) => {
          acc[field.name] = (item[field.name] !== null && item[field.name] !== undefined) ? item[field.name] : "";
        return acc;
      }, {})
    );
  };

  const handleDelete = async (id) => {
    await fetch(`${API_BASE}/${config.endpoint}/${id}`, { method: "DELETE" });
    loadItems();
  };

  return (
    <div className="container">
      <header>
        <h1>Emisión de Pólizas</h1>
        <p>Administración de clientes, planes y pólizas.</p>
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
            <label key={field.name}>
              {field.label}
              <input
                name={field.name}
                value={form[field.name]}
                onChange={(event) =>
                  setForm({ ...form, [field.name]: event.target.value })
                }
              />
            </label>
          ))}
          <button type="submit" className="primary">
            {editingId ? "Actualizar" : "Guardar"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(defaultForm(config.fields));
              }}
            >
              Cancelar
            </button>
          )}
          {message && <p className="message">{message}</p>}
        </form>

        <div className="card">
          <h2>Listado</h2>
          <div className="list">
            {items.map((item) => (
              <div key={item.id} className="list-item">
                <pre>{JSON.stringify(item, null, 2)}</pre>
                <div className="actions">
                  <button onClick={() => handleEdit(item)}>Editar</button>
                  <button className="danger" onClick={() => handleDelete(item.id)}>
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
            {!items.length && <p className="empty">Sin registros</p>}
          </div>
        </div>
      </section>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
