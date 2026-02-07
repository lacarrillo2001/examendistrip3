package ec.edu.espe.colinaexamen3.service;

import ec.edu.espe.colinaexamen3.mysql.repository.ClienteRepository;
import ec.edu.espe.colinaexamen3.mysql.repository.PlanSeguroRepository;
import ec.edu.espe.colinaexamen3.postgres.entity.Poliza;
import ec.edu.espe.colinaexamen3.postgres.repository.PolizaRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional("postgresTransactionManager")
public class PolizaService {

    private final PolizaRepository polizaRepository;
    private final ClienteRepository clienteRepository;
    private final PlanSeguroRepository planSeguroRepository;

    public PolizaService(
            PolizaRepository polizaRepository,
            ClienteRepository clienteRepository,
            PlanSeguroRepository planSeguroRepository) {
        this.polizaRepository = polizaRepository;
        this.clienteRepository = clienteRepository;
        this.planSeguroRepository = planSeguroRepository;
    }

    public List<Poliza> findAll() {
        return polizaRepository.findAll();
    }

    public Poliza findById(Long id) {
        return polizaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Poliza no encontrada"));
    }

    public Poliza save(Poliza poliza) {
        validateReferences(poliza.getClienteId(), poliza.getPlanSeguroId());
        return polizaRepository.save(poliza);
    }

    public Poliza update(Long id, Poliza payload) {
        Poliza existing = findById(id);
        validateReferences(payload.getClienteId(), payload.getPlanSeguroId());
        existing.setNumeroPoliza(payload.getNumeroPoliza());
        existing.setFechaInicio(payload.getFechaInicio());
        existing.setFechaFin(payload.getFechaFin());
        existing.setPrimaMensual(payload.getPrimaMensual());
        existing.setEstado(payload.getEstado());
        existing.setClienteId(payload.getClienteId());
        existing.setPlanSeguroId(payload.getPlanSeguroId());
        return polizaRepository.save(existing);
    }

    public void delete(Long id) {
        polizaRepository.deleteById(id);
    }

    private void validateReferences(Long clienteId, Long planSeguroId) {
        if (clienteId == null || !clienteRepository.existsById(clienteId)) {
            throw new IllegalArgumentException("Cliente no encontrado");
        }
        if (planSeguroId == null || !planSeguroRepository.existsById(planSeguroId)) {
            throw new IllegalArgumentException("PlanSeguro no encontrado");
        }
    }
}
