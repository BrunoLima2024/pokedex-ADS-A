import express,{Request, Response} from "express";
import path from "path";
import { ReplOptions } from "repl";

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "/views"));

app.get('/', function (request, response) {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1000")
        .then(res => res.json())
        .then(data => {
            const pokemons = data.results.map((pokemon, index) => ({
                ...pokemon,
                id: index + 1 
            }));
            response.render("index", { results: pokemons });
        })
        .catch(error => {
            console.error('Erro ao buscar dados:', error);
            response.status(500).send('Erro ao buscar dados');
        });
});

app.get('/detalhar/:name', function (req: Request, res: Response) {
    const pokemonName = req.params.name;
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
        .then(response => response.json())
        .then(pokemonData => {
            const abilities = pokemonData.abilities.map((ability: any) => ability.ability.name).join(', ');
            const types = pokemonData.types.map((type: any) => type.type.name).join(', ');
            const height = pokemonData.height;
            const weight = pokemonData.weight;
            const stats = pokemonData.stats.map((stat: any) => `${stat.stat.name}: ${stat.base_stat}`).join(', ');
            const imageUrl = pokemonData.sprites.other['showdown'].front_default; // Sprite da geração XY
            const typeClasses = pokemonData.types.map((type: any) => `type-${type.type.name}`).join(' ');
            const moves = pokemonData.moves.map(move => `<li>${move.move.name}</li>`).join('');


            const responseText = `
            <!DOCTYPE html>
            <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Detalhes do Pokémon</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f5f5f5;
                        margin: 0;
                        padding: 20px;
                        text-align: center;
                        overflow: auto; /* Permitir rolagem */
                    }
                    .container {
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #ffffff;
                        border: 1px solid #dddddd;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0,0,0,0.1);
                        position: relative;
                    }
                    .pokemon-info {
                        border: 1px solid #dddddd;
                        padding: 20px;
                        border-radius: 8px;
                        background-color: #f9f9f9;
                        text-align: left;
                    }
                    .pokemon-info h1 {
                        margin-top: 0;
                        font-size: 24px;
                        color: #333333;
                    }
                    .pokemon-info img {
                        max-width: 500px; /* Aumenta o tamanho da imagem */
                        height: auto;
                        display: block;
                        margin: 0 auto 15px;
                        border: 2px solid #cccccc;
                        border-radius: 8px;
                    }
                    p {
                        margin: 8px 0;
                        font-size: 16px;
                        color: #555555;
                    }
                    .label {
                        font-weight: bold;
                        color: #333333;
                    }
                    .pokemon-moves {
                        margin-top: 20px;
                        border-top: 1px solid #dddddd;
                        padding-top: 20px;
                    }
                    .pokemon-moves h2 {
                        font-size: 20px;
                        color: #333333;
                    }
                    .pokemon-moves ul {
                        list-style: none;
                        padding: 0;
                    }
                    .pokemon-moves li {
                        background-color: #f9f9f9;
                        border: 1px solid #dddddd;
                        border-radius: 8px;
                        margin: 5px 0;
                        padding: 10px;
                        font-size: 16px;
                        transition: background-color 0.3s;
                    }
                    .pokemon-moves li:hover {
                        background-color: #e0e0e0;
                    }
                    .type-grass {
                        border-left: 5px solid #78c850;
                    }
                    .type-fire {
                        border-left: 5px solid #f08030;
                    }
                    .type-water {
                        border-left: 5px solid #6890f0;
                    }
                    .type-electric {
                        border-left: 5px solid #f8d030;
                    }
                    .type-bug {
                        border-left: 5px solid #a8b820;
                    }
                    /* Adicione mais estilos para outros tipos aqui */
                    .back-button {
                        display: inline-block;
                        margin-top: 20px;
                        padding: 10px 20px;
                        font-size: 16px;
                        color: #ffffff;
                        background-color: #007bff;
                        border: none;
                        border-radius: 8px;
                        text-decoration: none;
                        cursor: pointer;
                        transition: background-color 0.3s, transform 0.3s;
                    }
                    .back-button:hover {
                        background-color: #0056b3;
                        transform: scale(1.1);
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="pokemon-info ${typeClasses}">
                        <h1>Detalhes do Pokémon: ${pokemonName}</h1>
                        <img src="${imageUrl}" alt="Imagem do Pokémon ${pokemonName}">
                        <p><span class="label">Tipos:</span> ${types}</p>
                        <p><span class="label">Altura:</span> ${height / 10} m</p>
                        <p><span class="label">Peso:</span> ${weight / 10} kg</p>
                        <p><span class="label">Habilidades:</span> ${abilities}</p>
                        <p><span class="label">Estatísticas:</span> ${stats}</p>

                        <div class="pokemon-moves">
                            <h2>Movimentos</h2>
                            <ul>
                                ${moves}
                            </ul>
                        </div>

                        <a href="/" class="back-button">Voltar</a>
                    </div>
                </div>
            </body>
            </html>`;

            res.send(responseText);
        })
        .catch(error => {
            res.status(500).send("Erro ao buscar dados do Pokémon.");
        });
});


app.listen(3000, function () {
    console.log("Server is running");
})
