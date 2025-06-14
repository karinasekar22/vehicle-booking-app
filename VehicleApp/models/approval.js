module.exports = (sequelize, DataTypes) => {
  const Approval = sequelize.define(
    "Approval",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      booking_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      approver_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "User",
          key: "id",
        },
      },

      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "pending",
      },
      approved_at: DataTypes.DATE,
    },
    {
      tableName: "Approval",
      timestamps: false,
    }
  );
  return Approval;
};
