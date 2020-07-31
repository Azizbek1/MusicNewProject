const express  = require('express');

const router = express.Router();

// User kiritamiz MODEL 
const User = require('../model/User')

// Music kiritamiz MODEL 
const Music = require('../model/Music')


// url orqali kirmasligi uchun middle function 

const eA = (req, res, next) => {
    if(req.isAuthenticated()){
        next()
    }else{
        req.flash('danger', 'Iltimos tizimga kiring va royhatdan oting')
        res.redirect('/login')
    }
}







// music/add routeri 
router.get('/musics/add', eA, (req, res) => {
    res.render('music_add', {
         title: `Musiqa Qo'shish sahifasi`
    })
})

// Malumotlar bazasiga ulanganimizdan keyin robo mongodan malumotlarni olamiz
router.get('/', (req, res) => {
 
    Music.find({}, (err, music) => {
        if(err) console.log(err);
        else{
            res.render('index', {
                title: `Bosh sahifa`, 
                musics: music
            })
        }
    })
})


// music/add routeri // post metodi orqali
router.post('/musics/add', eA, (req, res) => {
    req.checkBody('name', `Isim bo'sh bo'lmasligi kerak`).notEmpty()
    // req.checkBody('singer', `Bastakor bo'sh bo'lmasligi kerak`).notEmpty()
    req.checkBody('comment', `Izoh bo'sh bo'lmasligi kerak`).notEmpty()

    const errors = req.validationErrors();
    if(errors){
        res.render('music_add', {
            title: 'Musiqa qoshish',
            errors: errors
        })
    }
    else{
        const music = new Music(); 
        music.name = req.body.name;
        // Id olish kerak 
        music.singer = req.user._id;
        music.comment = req.body.comment;
        music.save((err) => {
            if(err) console.log(err);
            else{
                // musiqa muofiqiyatli qo'shdi
                req.flash('success', `Musiqa muofiqiyatli qo'shildi`)
                res.redirect('/')
            }
        })
    }

    
})


// id orqali tutamiz
router.get('/musics/:id',  eA ,(req,res) => {
    Music.findById(req.params.id, (err, music) => {

        // // SHu yerga qo'shamiz 
        User.findById(music.singer, (err, user) => {
            res.render('music', {
                music: music,
                singer: user.name
            });
        });

    });
});


// id orqali o'zgartiramiz
router.get('/music/edit/:id', eA, (req, res) => {
    Music.findById(req.params.id, (err, music) => {

        // bu yerda EDIT sahifasida formda ko'rinyatudi
        if(music.singer !== req.user._id){
            req.flash('danger', 'Haqigiz yoq');
            res.redirect('/')
        }
        res.render('musics_edit', {
            title: `Musiqani o'zgartiramiz`,
            music: music
        })
    })
})

// post orqali o'zgartiramiz Method Update
router.post('/music/edit/:id', eA,(req, res) => {
    const music = {};
    music.name = req.body.name;
    music.singer = req.body.singer;
    music.comment = req.body.comment;

    const query = {_id:req.params.id}

    Music.updateOne(query, music, (err) => {
        if(err) console.log(err);
        else{
            req.flash('success', `Musiqa muofiqiyatli Almashdi`)
            res.redirect('/')
        }
    })
})

// Delete orqali qilamiz
router.delete('/musics/:id', eA, (req, res) => {

    if(!req.user._id){
        res.status(500).send();
    }
    let a = {_id: req.params.id};

    Music.findById(req.params.id, (err, music) => {
        if(music.singer != req.user._id){
            res.status(500).send();
        }
        else{
            Music.findOneAndDelete(a, (err) => {
                if(err) console.log(err);
                res.send('Success')
            })
        }
    })

    
})





module.exports = router;
