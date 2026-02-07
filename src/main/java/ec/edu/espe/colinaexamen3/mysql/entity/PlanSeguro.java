package ec.edu.espe.colinaexamen3.mysql.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;

@Entity
@Table(name = "planes_seguro")
public class PlanSeguro {

    public enum TipoPlan {
        VIDA,
        AUTO,
        SALUD
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;

    @Enumerated(EnumType.STRING)
    private TipoPlan tipo;

    private BigDecimal primaBase;
    private BigDecimal coberturaMax;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public TipoPlan getTipo() {
        return tipo;
    }

    public void setTipo(TipoPlan tipo) {
        this.tipo = tipo;
    }

    public BigDecimal getPrimaBase() {
        return primaBase;
    }

    public void setPrimaBase(BigDecimal primaBase) {
        this.primaBase = primaBase;
    }

    public BigDecimal getCoberturaMax() {
        return coberturaMax;
    }

    public void setCoberturaMax(BigDecimal coberturaMax) {
        this.coberturaMax = coberturaMax;
    }
}
