package com.skapp.community.peopleplanner.repository;

import com.skapp.community.common.type.Role;
import com.skapp.community.peopleplanner.model.EmployeeRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRoleDao extends JpaRepository<EmployeeRole, Long> {

	boolean existsByIsSuperAdminTrue();

	long countByIsSuperAdminTrue();

	List<EmployeeRole> findEmployeesByPeopleRole(Role roleName);

	long countByEsignRoleAndIsSuperAdmin(Role roleName, boolean isSuperAdmin);

}
