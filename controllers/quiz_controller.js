var models = require('../models/models.js');

// Autoload - factoriza el codigo si ruta inclute :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.find(quizId).then(
		function(quiz) {
			if (quiz) {
				req.quiz = quiz;
				next();
			} else {
				next(new Error('No existe quizId=' + quizId));
			}
		}).catch(function(error) {next(error);});
}


// GET /quizes
exports.index = function(req, res) {
	if (req.query.search) {
		console.log('estamos buscando');
		var aux = req.query.search.replace(' ','%');
		console.log('aux: '+aux);
		models.Quiz.findAll({where: ["pregunta like ?", '%'+aux+'%']}).then(function(quizes) {
			res.render('quizes/index.ejs', {quizes: quizes, errors: []});
		});


	} else {
		models.Quiz.findAll().then(function(quizes) {
			res.render('quizes/index.ejs', {quizes: quizes, errors: []});
		});	
	}
	
};
// GET /quizes/question
/*exports.question = function(req, res) {
	models.Quiz.findAll().success(function(quiz) {
		res.render('quizes/question', {pregunta: quiz[0].pregunta});	
	})
};*/
exports.show = function(req, res) {	
	res.render('quizes/show', {quiz: req.quiz, errors: []});	
};

// GET /quizes/answer
/*exports.answer = function(req, res) {
	models.Quiz.findAll().success(function(quiz) {
		if (req.query.respuesta === quiz[0].respuesta) {
			res.render('quizes/answer', {respuesta: 'Correcto'});
		} else {
			res.render('quizes/answer', {respuesta: 'Incorrecto'});

		}	
	})
}; */
exports.answer = function(req, res) {
	if (req.query.respuesta === req.quiz.respuesta) {
		res.render('quizes/answer', 
			{quiz: req.quiz, respuesta: 'Correcto', errors: []});
	} else {
		res.render('quizes/answer', 
			{quiz: req.quiz, respuesta: 'Incorrecto', errors: []});

	}		
	
};

// GET /quizes/author
exports.author = function(req, res) {
	res.render('quizes/author', {title: 'Créditos', errors: []});

};

// GET /quizes/new
exports.new = function(req, res) {

	var quiz = models.Quiz.build( //crear objeto quiz
		{pregunta: "Pregunta", respuesta: "Respuesta"});

	res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build(req.body.quiz);

	quiz.validate().then(function (err){
		if (err) {
			res.render('quizes/new', {quiz: quiz, errors: err.errors});

		} else {
			// guarda en DB los campos pregunta y respuesta de Quiz
			quiz.save({fields: ["pregunta", "respuesta"]}).then(function() {
				res.redirect('/quizes');
			}) // redireccion HTTP a lista de preguntas

		}
	});
	
};

// GET quizes/:id/edit
exports.edit = function(req, res) {
	var quiz = req.quiz;

	res.render('quizes/edit', {quiz: quiz, errors: []});

};

// PUT /quizes/:id

exports.update = function(req, res){
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;

	req.quiz
			.save({fields: ["pregunta", "respuesta"]})
			.then( function() {res.redirect('/quizes');});				
};

// DELETE /quizes/:id

exports.destroy = function(req, res) {
	req.quiz.destroy().then(function() {
		res.redirect('/quizes');
	}).catch(function (error){next(error)});

};
		