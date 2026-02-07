package ec.edu.espe.colinaexamen3.service;

import ec.edu.espe.colinaexamen3.mysql.entity.PlanSeguro;
import ec.edu.espe.colinaexamen3.mysql.repository.PlanSeguroRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional("mysqlTransactionManager")
public class PlanSeguroService {

    private final PlanSeguroRepository planSeguroRepository;

    public PlanSeguroService(PlanSeguroRepository planSeguroRepository) {
        this.planSeguroRepository = planSeguroRepository;
    }

    public List<PlanSeguro> findAll() {
        return planSeguroRepository.findAll();
    }

    public PlanSeguro findById(Long id) {
        return planSeguroRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Plan no encontrado"));
    }

    public PlanSeguro save(PlanSeguro planSeguro) {
        return planSeguroRepository.save(planSeguro);
    }

    public PlanSeguro update(Long id, PlanSeguro payload) {
        PlanSeguro existing = findById(id);
        existing.setNombre(payload.getNombre());
        existing.setTipo(payload.getTipo());
        existing.setPrimaBase(payload.getPrimaBase());
        existing.setCoberturaMax(payload.getCoberturaMax());
        return planSeguroRepository.save(existing);
    }

    public void delete(Long id) {
        planSeguroRepository.deleteById(id);
    }
}
