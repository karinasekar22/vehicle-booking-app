module.exports = (sequelize, DataTypes) => {
  const Vehicle = sequelize.define(
    "Vehicle",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      plate_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [["angkutan orang", "angkutan barang"]],
        },
      },
      is_rented: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [["owned", "rented"]],
        },
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "available",
        validate: {
          isIn: [["available", "booked", "in use", "in service", "broken"]],
        },
      },
      service_schedule: DataTypes.DATE,
      fuel_type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [
            [
              "solar",
              "bensin",
              "pertalite",
              "pertamax",
              "bio solar",
              "listrik",
              "lainnya",
            ],
          ],
        },
      },
      fuel_consumption: DataTypes.FLOAT,
    },
    {
      tableName: "Vehicle",
      timestamps: false,
    }
  );
  return Vehicle;
};
