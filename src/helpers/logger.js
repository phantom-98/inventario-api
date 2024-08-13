import Log from'../models/Log.js';

const logUserAction = async (userId, action, prevData = "", newData = "")=> {
  try {
    const log = new Log({
      userId,
      action,
      prevData,
      newData
    });
    await log.save();
    console.log('Acción registrada con éxito:', action);
  } catch (err) {
    console.error('Error al registrar la acción', err);
  }
}

export default logUserAction;


// await logUserAction(req.user.id, 'Created a new resource', { resourceId: newResource._id });