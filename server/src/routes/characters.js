const express = require('express');
const pool = require('../db');

const router = express.Router();


router.get('/', async (req, res) => {

    try {

        const result = await pool.query(
            "SELECT * FROM characters"
        );

        res.json(result.rows);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({
            error: 'Database Error'
        });

    }

});


router.post('/', async (req, res) => {

    const {
        name,
        description,
        aiInfo,
        imageUrl,
        published = false
    } = req.body;

    try {

        const result = await pool.query(
            `INSERT INTO characters
                (name, description, ai_info, image_url, published)
             VALUES
                ($1, $2, $3, $4, $5)
             RETURNING *`,
            [
                name,
                description || '',
                aiInfo || '',
                imageUrl || '',
                published
            ]
        );

        res.status(201).json(result.rows[0]);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({
            error: 'Database Error'
        });

    }

});


router.patch('/:id/like', async (req, res) => {

    const { id } = req.params;

    try {

        const result = await pool.query(
            `UPDATE characters
             SET likes = likes + 1
             WHERE id = $1
             RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                error: 'Character not found'
            });

        }

        res.json(result.rows[0]);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({
            error: 'Database Error'
        });

    }

});


module.exports = router;