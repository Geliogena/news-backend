import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UpdateGenreColumnInNews implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      "News", 
      "genre", 
      new TableColumn({
        name: "genre",
        type: "enum",
        enum: ["Politic", "Business", "Sport", "Other"], 
        isNullable: false
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      "News",
      "genre",
      new TableColumn({
        name: "genre",
        type: "varchar",
        isNullable: false
      })
    );
  }
}