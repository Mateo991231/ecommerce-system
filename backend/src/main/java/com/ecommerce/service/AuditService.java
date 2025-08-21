package com.ecommerce.service;

import com.ecommerce.entity.AuditLog;
import com.ecommerce.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuditService {
    @Autowired
    private AuditLogRepository auditLogRepository;

    public void logAction(String entityName, Long entityId, String action, Long userId, String oldValues, String newValues) {
        AuditLog auditLog = new AuditLog(entityName, entityId, action, userId, oldValues, newValues);
        auditLogRepository.save(auditLog);
    }
}