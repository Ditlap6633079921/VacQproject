// declare all things ;)
const express = require('express');
const router = express.Router();
//const { getUsers, getUser, createUser, updateUser, deleteUser } = require('../controllers/usercontroller');
const {getUser,createUser} = require('../controllers/usercontroller');
const { protect, authorize } = require('../middleware/auth');


//make route for methods
router.route('/').post(protect,authorize("admin","user"),createUser);
//.post(getUsers);

router.route('/:id').get(protect,authorize("admin"),getUser);
    //.put(updateUser)
    //.delete(deleteUser);


module.exports = router;