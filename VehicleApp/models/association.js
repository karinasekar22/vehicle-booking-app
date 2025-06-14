module.exports = (db) => {
  // User
  db.User.hasMany(db.Booking, { foreignKey: "user_id" });
  db.User.hasMany(db.Approval, { foreignKey: "approver_id" });

  // Booking
  db.Booking.belongsTo(db.User, { foreignKey: "user_id" });
  db.Booking.belongsTo(db.Vehicle, { foreignKey: "vehicle_id" });
  db.Booking.belongsTo(db.Driver, { foreignKey: "driver_id" });
  db.Booking.hasMany(db.Approval, { foreignKey: "booking_id" });

  // Approval
  db.Approval.belongsTo(db.Booking, { foreignKey: "booking_id" });
  db.Approval.belongsTo(db.User, { foreignKey: "approver_id" });

  // Driver
  db.Driver.hasMany(db.Booking, { foreignKey: "driver_id" });

  // Vehicle
  db.Vehicle.hasMany(db.Booking, { foreignKey: "vehicle_id" });

  db.FuelLog.belongsTo(db.Vehicle, { foreignKey: "vehicle_id" });
  db.ServiceLog.belongsTo(db.Vehicle, { foreignKey: "vehicle_id" });

  db.Log.belongsTo(db.User, { foreignKey: 'user_id' });

};
