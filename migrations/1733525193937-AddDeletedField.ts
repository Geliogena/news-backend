
import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddDeletedField1678901234567 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    
    await queryRunner.addColumn(
      "newsposts",
      new TableColumn({
        name: "deleted",
        type: "boolean",
        isNullable: false,
        default: false,
      })
    );

    
    await queryRunner.addColumn(
      "users",
      new TableColumn({
        name: "deleted",
        type: "boolean",
        isNullable: false,
        default: false,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    
    await queryRunner.dropColumn("newsposts", "deleted");

    
    await queryRunner.dropColumn("users", "deleted");
  }
}
