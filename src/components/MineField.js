import React from 'react'
import { View, StyleSheet } from 'react-native'
import Field from './Field'

export default props => {
    const rows = props.board.map((row, r) => {  // tabuleiro 'board'
        const columns = row.map((field, c) => { //*map transforma um array de arrays (matriz) em um array do mesmo tamanho com elementos JSX
            return <Field {...field} key={c}    // essa chave serve para o react se achar melhor na hora de passar alguma informação
                onOpen={() => props.onOpenField(r, c)} 
                onSelect={e => props.onSelectField(r, c)}/>
        })
        return <View key={r}
            style={{flexDirection: 'row'}}>{columns}</View>
    })
    return <View style={styles.container}>{rows}</View>
}

const styles = StyleSheet.create({
    container: {
        //flexDirection: 'row', -> Errado estar aqui pois joga tudo deitado
        backgroundColor: '#EEE',
    }
})