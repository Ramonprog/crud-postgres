const { query } = require("express");
const pool = require("../connect");

const insertingAuthor = async (req, res) => {
  const { nome, idade } = req.body;

  if (!nome.trim()) return res.json({ mensagem: "o campo nome é obrigatório" });

  const query = "INSERT INTO autores (nome, idade) VALUES ( $1, $2 )";
  const params = [nome, idade];
  try {
    const result = await pool.query(query, params);

    return res.status(201).json(result.rows);
  } catch (error) {
    console.log(error.message);
  }
};

const findingAuthor = async (req, res) => {
  const { id } = req.params;

  if (!id) return res.json({ mensagem: "Autor não encontrado" });

  const query = `SELECT a.id, a.nome AS nome_autor, a.idade,
    l.id AS id_livro, l.nome AS nome_livro, l.genero,
    l.editora, l.data_public
    FROM autores a FULL JOIN livros l ON a.id = l.id_autor WHERE a.id = $1
  `;

  const params = [id];

  try {
    const { rows, rowCount } = await pool.query(query, params);

    if (rowCount === 0) return res.json({ mensagem: "Autor não encontrado" });

    const books = rows.map((item) => {
      return {
        id: item.id_livro,
        nome: item.nome_livro,
        genero: item.genero,
        editora: item.editora,
        data: item.data_public,
      };
    });

    const author = {
      id: rows[0].id,
      nome: rows[0].nome_autor,
      idade: rows[0].idade,
      books,
    };

    return res.status(200).json(author);
  } catch (error) {
    console.log(error.message);
  }
};

const insertinBook = async (req, res) => {
  const { id } = req.params;
  const { nome, genero, editora, data_publicacao } = req.body;

  if (!id) return res.status(400).json({ mensagem: "insira o id do autor" });
  if (!nome)
    return res.status(400).json({ mensagem: "o campo nome é obrigatório." });

  const query = `INSERT INTO livros 
                    (nome, genero, editora, data_public, id_autor) 
                    VALUES($1, $2, $3, $4, $5)
                `;
  const params = [nome, genero, editora, data_publicacao, id];

  try {
    const { rows } = await pool.query(query, params);

    return res.status(200).json(rows);
  } catch (error) {
    console.log(error.message);
  }
};

const findBooks = async (req, res) => {
  const query = `
    SELECT l.id, l.nome, l.genero, l.editora, l.data_public,
    a.id AS id_autor, 
    a.nome AS nome_autor, a.idade
    FROM livros l JOIN autores a ON l.id_autor= a.id
  `;

  try {
    const { rows } = await pool.query(query);

    const livro = rows.map((livro) => {
      return {
        id: livro.id,
        nome: livro.nome,
        genero: livro.genero,
        editora: livro.editora,
        data_publicacao: livro.data_public,
        author: {
          id: livro.id_autor,
          nome: livro.nome_autor,
          idade: livro.idade,
        },
      };
    });

    return res.status(200).json(livro);
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  insertingAuthor,
  findingAuthor,
  insertinBook,
  findBooks,
};
