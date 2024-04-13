import { MigrationInterface, QueryRunner } from "typeorm"
import { RoleEnum } from '../modules/auth/enums/role.enum';
import { v4 } from "uuid";

export class CreateRole1713011317722 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO role (uuid, role) VALUES ("${v4()}", "${RoleEnum.SuperAdmin}"), ("${v4()}", "${RoleEnum.Admin}"), ("${v4()}", "${RoleEnum.User}")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM role`);
    }

}
