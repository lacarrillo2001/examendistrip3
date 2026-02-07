package ec.edu.espe.colinaexamen3.web;

import ec.edu.espe.colinaexamen3.mysql.entity.PlanSeguro;
import ec.edu.espe.colinaexamen3.service.PlanSeguroService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/planes")
public class PlanSeguroController {

    private final PlanSeguroService planSeguroService;

    public PlanSeguroController(PlanSeguroService planSeguroService) {
        this.planSeguroService = planSeguroService;
    }

    @GetMapping
    public List<PlanSeguro> list() {
        return planSeguroService.findAll();
    }

    @GetMapping("/{id}")
    public PlanSeguro get(@PathVariable Long id) {
        return planSeguroService.findById(id);
    }

    @PostMapping
    public ResponseEntity<PlanSeguro> create(@RequestBody PlanSeguro planSeguro) {
        return ResponseEntity.ok(planSeguroService.save(planSeguro));
    }

    @PutMapping("/{id}")
    public PlanSeguro update(@PathVariable Long id, @RequestBody PlanSeguro planSeguro) {
        return planSeguroService.update(id, planSeguro);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        planSeguroService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
