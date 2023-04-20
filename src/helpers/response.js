const erroResp = (res , code , msg) => res.status(code).json({msg});


export { erroResp };