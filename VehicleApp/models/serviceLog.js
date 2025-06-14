
module.exports = (sequelize, DataTypes) => {
  const ServiceLog = sequelize.define(
    "ServiceLog",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      vehicle_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      service_date: DataTypes.DATE,
      description: DataTypes.TEXT,
    },
    {
      tableName: "ServiceLog",
      timestamps: false,
    }
  );
  return ServiceLog;
};
