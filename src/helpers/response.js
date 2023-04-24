const response = (res , code , msg) => res.status(code).json({msg});


export { response };