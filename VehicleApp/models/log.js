module.exports = (sequelize, DataTypes) => {
  const Log = sequelize.define("Log", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    action: DataTypes.STRING,
    target_id: {
      type:DataTypes.UUID,
      allowNull: false,
    },
    timestamp: DataTypes.DATE,
  });

  return Log;
};
