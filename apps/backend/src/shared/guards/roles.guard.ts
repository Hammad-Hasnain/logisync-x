import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        // Read the required roles attached to the controller endpoint via metadata
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // If the route has no specific @Roles decorator, let it pass safely (Public or just Auth required)
        if (!requiredRoles) {
            return true;
        }

        // Extract the authenticated user object from the HTTP request context (populated by Passport)
        const { user } = context.switchToHttp().getRequest();

        if (!user || !user.role) {
            throw new ForbiddenException('Access Denied: Missing structural role parameters inside token payload.');
        }

        // Authorization Check: Verify if the user's role matches the required endpoint permission matrix
        const hasPermission = requiredRoles.some((role) => user.role === role);

        if (!hasPermission) {
            throw new ForbiddenException('Access Denied: You do not have the elite administrative privileges to execute this transaction.');
        }

        return true;
    }
}
