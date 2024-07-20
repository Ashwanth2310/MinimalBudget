import * as React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Category ,Transaction} from '../types';
import { useSQLiteContext } from 'expo-sqlite';
import TransactionList from '../components/TransactionsList';


const Home: React.FC = () => {
    const [categories, setCategories] = React.useState<Category[]>([]);
    const [transactions, setTransactions] = React.useState<Transaction[]>([]);
    
    const db = useSQLiteContext();

    React.useEffect(()=>{
        db.withTransactionAsync(async()=>{
            await getData()
        })
    },[db])

    async function getData() {
        const result = await db.getAllAsync<Transaction>(`SELECT * FROM Transactions ORDER BY date DESC;`);
        setTransactions(result);   
        const categoriesResult = await db.getAllAsync<Category>(`SELECT * FROM Categories;`);
        setCategories(categoriesResult);    
        
    }
    async function deleteTransaction(id:number) {
        db.withTransactionAsync(async()=>{
            await db.runAsync('DELETE FROMO Transactions WHERE id = ?;'[id])
            await getData();
        })
        
    }


    return (
        <ScrollView contentContainerStyle={{padding:15,paddingVertical:20}}>
            <TransactionList
            categories={categories}
            transactions={transactions}
            deleteTransaction={deleteTransaction}
            />
        </ScrollView>
    );
};

export default Home;
