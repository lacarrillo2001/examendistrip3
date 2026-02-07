package ec.edu.espe.colinaexamen3.postgres.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "polizas")
public class Poliza {

    public enum EstadoPoliza {
        ACTIVA,
        CANCELADA
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String numeroPoliza;

    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private BigDecimal primaMensual;

    @Enumerated(EnumType.STRING)
    private EstadoPoliza estado;

    private Long clienteId;
    private Long planSeguroId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumeroPoliza() {
        return numeroPoliza;
    }

    public void setNumeroPoliza(String numeroPoliza) {
        this.numeroPoliza = numeroPoliza;
    }

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDate getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }

    public BigDecimal getPrimaMensual() {
        return primaMensual;
    }

    public void setPrimaMensual(BigDecimal primaMensual) {
        this.primaMensual = primaMensual;
    }

    public EstadoPoliza getEstado() {
        return estado;
    }

    public void setEstado(EstadoPoliza estado) {
        this.estado = estado;
    }

    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public Long getPlanSeguroId() {
        return planSeguroId;
    }

    public void setPlanSeguroId(Long planSeguroId) {
        this.planSeguroId = planSeguroId;
    }
}
