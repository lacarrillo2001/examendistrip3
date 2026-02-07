package ec.edu.espe.colinaexamen3.mysql.repository;

import ec.edu.espe.colinaexamen3.mysql.entity.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
}
