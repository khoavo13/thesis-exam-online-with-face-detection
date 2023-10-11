package dacn.backend.core.controller;

import dacn.backend.core.common.enums.Role;
import dacn.backend.core.util.Mapper;
import org.springframework.beans.factory.annotation.Autowired;

public abstract class BaseController {
    @Autowired
    Mapper mapper;

    public final String teacherRole = Role.TEACHER.name();
    public final String studentRole = Role.STUDENT.name();
    public final String adminRole = Role.ADMIN.name();
}
