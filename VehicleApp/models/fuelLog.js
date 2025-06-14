
module.exports = (sequelize, DataTypes) => {
  const FuelLog = sequelize.define(
    "FuelLog",
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
      date: DataTypes.DATE,
      amount: DataTypes.FLOAT,
      km_reading: DataTypes.INTEGER,
    },
    {
      tableName: "FuelLog",
      timestamps: false,
    }
  );
  return FuelLog;
};
