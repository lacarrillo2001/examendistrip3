package ec.edu.espe.colinaexamen3.service;

import ec.edu.espe.colinaexamen3.mysql.entity.Cliente;
import ec.edu.espe.colinaexamen3.mysql.repository.ClienteRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional("mysqlTransactionManager")
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    public List<Cliente> findAll() {
        return clienteRepository.findAll();
    }

    public Cliente findById(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cliente no encontrado"));
    }

    public Cliente save(Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    public Cliente update(Long id, Cliente payload) {
        Cliente existing = findById(id);
        existing.setNombres(payload.getNombres());
        existing.setIdentificacion(payload.getIdentificacion());
        existing.setEmail(payload.getEmail());
        existing.setTelefono(payload.getTelefono());
        return clienteRepository.save(existing);
    }

    public void delete(Long id) {
        clienteRepository.deleteById(id);
    }
}
