//Todas as funções de criações dos tabuleiros

const createBoard = (rows, columns) => {
    return Array(rows).fill(0).map((_, row) => { // matriz com varios objetos para criar tabuleiro
        return Array(columns).fill(0).map((_, column) => {
            return {
                row,
                column,
                opened: false,
                flagged: false,
                mined: false,
                exploded: false,
                nearMines: 0,
            }
        })
    })
}

const spreadMines = (board, minesAmount) => { // espalhar minas no tabuleiro
    const rows = board.length
    const columns = board[0].length
    let minesPlanted = 0

    while (minesPlanted < minesAmount) {
        const rowSel = parseInt(Math.random() * rows, 10)
        const columnSel = parseInt(Math.random() * columns, 10)

        if (!board[rowSel][columnSel].mined) {
            board[rowSel][columnSel].mined = true
            minesPlanted++
        }
    }
}

const createMinedBoard = (rows, columns, minesAmount) => { //criando tabuleiro minado e exportando
    const board = createBoard(rows, columns)
    spreadMines(board, minesAmount)
    return board
}

const cloneBoard = board => { //clonar os tabuleiros 
    return board.map(rows => {
        return rows.map(field => {
            return { ...field }
        })
    })
}

const getNeighbors = (board, row, column) => { // verificando os vizinhos
    const neighbors = []
    const rows = [row - 1, row, row + 1]
    const columns = [column - 1, column, column + 1]
    rows.forEach(r => {
        columns.forEach(c => {
            const diferent = r !== row || c !== column
            const validRow = r >= 0 && r < board.length  //linha valida
            const validColumn = c >= 0 && c < board[0].length //coluna valida
            if (diferent && validRow && validColumn) { //testando... se ok adiciona o vizinho
                neighbors.push(board[r][c])
            }
        })
    })
    return neighbors //retorna os vizinhos que estão ok, e joga dentro do nó (board, row e column)

}

const safeNeighborhood = (board, row, column) => { // verificar se tem mina ou nao usando *REDUCE
    const safes = (result, neighbors) => result && !neighbors.mined //se o vizinho nao estiver minado toda essa expressao vai dar false
    return getNeighbors(board, row, column).reduce(safes, true)
}

//exemplo: vizinho 1 : mined = false
//vizinho 2 : mined = false
//vizinho 3 : mined = false
// se vizinhos.reduce(safes, true)
// entao tudo é verdadeiro
//logo a vizinhança é segura
//se algum vizinho estiver como mined: true
//vizinhos.reduce(safe, false)
//logo não é seguro

// * a seguir o metodo mais importante da logica de funcionamento *
const openField = (board, row, column) => { // função para abrir o campo
    const field = board[row][column]
    if (!field.opened) { // a logica só é feita se nao estiver aberto
        field.opened = true // seta aberto para verdadeiro
        if (field.mined) { // se tiver minado seta o explodido
            field.exploded = true // setando o explodido para true
        } else if (safeNeighborhood(board, row, column)) { // se vizinhaça é segura
            getNeighbors(board, row, column)
                .forEach(n => openField(board, n.row, n.column)) // abre de forma recursiva ao abrir campo para outros campos ao redor
        } else {  //caso a vizinhança nao seja segura
            const neighbors = getNeighbors(board, row, column) //calcula a quantidade de minas 
            field.nearMines = neighbors.filter(n => n.mined).length //quantos vizinhos estao minados
        }
    }
}

//pegar todos os fields como um grande array juntando tudo .concat
const fields = board => [].concat(...board) // verificador se esta minado e expldido concatenando os
const hadExplosion = board => fields(board) //função para saber se tem algum campo explodido (fim de jogo)
    .filter(field => field.exploded).length > 0 // se for = true e o tamanho > 0 tem campo explodido (fim de jogo)
const pendding = field => (field.mined && !field.flagged)
    || (!field.mined && !field.opened)
const wonGame = board => fields(board).filter(pendding).length === 0 // função que verifica se ganhou o jogo
const showMines = board => fields(board).filter(field => field.mined) // função que mostra minas
    .forEach(field => field.opened = true)

const invertFlag = (board, row, column) => { //marcar a bandeira
    const field = board[row][column]    // pegar o ponto no tableiro
    field.flagged = !field.flagged
}

const flagsUsed = board => fields(board).filter(field => field.flagged).length

export {
    createMinedBoard,
    cloneBoard,
    openField,
    hadExplosion,
    wonGame,
    showMines,
    invertFlag,
    flagsUsed
}