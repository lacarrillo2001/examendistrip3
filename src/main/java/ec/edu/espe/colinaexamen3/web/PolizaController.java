package ec.edu.espe.colinaexamen3.web;

import ec.edu.espe.colinaexamen3.postgres.entity.Poliza;
import ec.edu.espe.colinaexamen3.service.PolizaService;
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
@RequestMapping("/api/polizas")
public class PolizaController {

    private final PolizaService polizaService;

    public PolizaController(PolizaService polizaService) {
        this.polizaService = polizaService;
    }

    @GetMapping
    public List<Poliza> list() {
        return polizaService.findAll();
    }

    @GetMapping("/{id}")
    public Poliza get(@PathVariable Long id) {
        return polizaService.findById(id);
    }

    @PostMapping
    public ResponseEntity<Poliza> create(@RequestBody Poliza poliza) {
        return ResponseEntity.ok(polizaService.save(poliza));
    }

    @PutMapping("/{id}")
    public Poliza update(@PathVariable Long id, @RequestBody Poliza poliza) {
        return polizaService.update(id, poliza);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        polizaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
