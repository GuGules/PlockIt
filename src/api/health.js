import express from 'express';

const router = express.Router();

router.get('/health', (req,res) => {
    // Startup endpoint
    res.status(200).json({status: 'OK'})
})

router.get('/ready', (req, res)=> {
    res.status(200).json({status: 'OK'})
})

router.get('/live', (req, res)=> {
    res.status(200).json({status: 'OK'})
})

export default router;