// NEW FEATURE: Swagger API Documentation Schemas

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: User login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */

/**
 * @swagger
 * /api/users/add:
 *   post:
 *     summary: Add new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *               site_name:
 *                 type: string
 *               module_count:
 *                 type: integer
 *     responses:
 *       200:
 *         description: User added successfully
 */

/**
 * @swagger
 * /api/sensor/latest:
 *   get:
 *     summary: Get latest sensor data
 *     tags: [Sensor]
 *     responses:
 *       200:
 *         description: Latest sensor readings
 */

/**
 * @swagger
 * /api/sensor:
 *   post:
 *     summary: Submit sensor data
 *     tags: [Sensor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               module_no:
 *                 type: integer
 *               voltage:
 *                 type: number
 *               current:
 *                 type: number
 *               temperature:
 *                 type: number
 *               humidity:
 *                 type: number
 *               smoke:
 *                 type: number
 *     responses:
 *       200:
 *         description: Sensor data processed
 */

/**
 * @swagger
 * /api/alerts:
 *   get:
 *     summary: Get alerts with filtering
 *     tags: [Alerts]
 *     parameters:
 *       - in: query
 *         name: module_no
 *         schema:
 *           type: integer
 *       - in: query
 *         name: is_cleared
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of alerts
 */

/**
 * @swagger
 * /api/logs:
 *   get:
 *     summary: Get system logs
 *     tags: [Logs]
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: action_type
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of logs
 */
