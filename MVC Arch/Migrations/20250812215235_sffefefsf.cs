using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MCV_Capstone.Migrations
{
    /// <inheritdoc />
    public partial class sffefefsf : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsRejected",
                table: "Courses",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsRejected",
                table: "Courses");
        }
    }
}
