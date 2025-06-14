
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type : DataTypes.STRING,
        allowNull : false,
      },
      email: {
        type : DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail : true,
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull : false,
        validate: {
          len: [6, 100]
        }
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate : {
          isIn: [['admin', 'approver']]
        }
      },
      level: DataTypes.INTEGER,
    },
    {
      tableName: "User",
      timestamps: false,
    }
  );
  return User;
};
