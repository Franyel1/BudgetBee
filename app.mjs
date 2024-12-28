import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import hbs from 'hbs';
import './db.mjs';
import mongoose from 'mongoose';
import session from 'express-session';
import sanitize from 'mongo-sanitize';
import * as auth from './auth.mjs';
import { animate, stagger } from 'motion';

dotenv.config();

const app = express();

app.set('view engine', 'hbs');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
}));

const Transaction = mongoose.model('Transaction');

/////////////////////////////////////////////////////////

hbs.registerHelper('formatDate', function (date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    const year = date.getUTCFullYear();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getUTCMonth()];
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${month}. ${day}, ${year}`;
});


hbs.registerHelper('eq', function (a, b) {
    return a === b;
});

hbs.registerHelper('and', (a, b) => a && b);

hbs.registerHelper('formatDate2', function (date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
});

const requireAuth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

//////////////////////////////////////////////////////


app.get('/session-debug', (req, res) => {
    res.send(req.session.user ? `Logged in as: ${req.session.user.username}` : 'Not logged in');
});

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});


app.get('/', (req, res) => res.redirect('/login'));

app.get('/login', (req, res) => res.render('login.hbs'));

app.post('/login', async (req, res) => {
    try {
        const sanitizedUsername = sanitize(req.body.username);
        const user = await auth.login(sanitizedUsername, req.body.password);
        await auth.startAuthenticatedSession(req, user);
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.render('login', { message: err.message || 'Login unsuccessful' });
    }
});

app.get('/dashboard', requireAuth, async (req, res) => {
    const userId = req.session.user._id;

    try {
        const transactions = await Transaction.find({ userId }).lean();

        const incomeBreakdown = transactions
            .filter(({ type }) => type === "income")
            .map(({ name, amount }) => ({ name, amount }));

        const expenseBreakdown = transactions
            .filter(({ type }) => type === "expense")
            .map(({ name, amount }) => ({ name, amount }));

        const income = incomeBreakdown.reduce((sum, { amount }) => sum + amount, 0);
        const expense = expenseBreakdown.reduce((sum, { amount }) => sum + amount, 0);

        const total = income + expense;
        const incomePercent = total > 0 ? ((income / total) * 100).toFixed(2) : 0;
        const expensePercent = total > 0 ? ((expense / total) * 100).toFixed(2) : 0;

        res.render('dashboard', {
            username: req.session.user.username,
            income,
            expense,
            incomeBreakdown: JSON.stringify(incomeBreakdown),
            expenseBreakdown: JSON.stringify(expenseBreakdown),
            incomePercent,
            expensePercent,
        });
    } catch (err) {
        console.error("Failed to retrieve transaction totals:", err);
        res.status(500).send("Failed to retrieve transaction totals.");
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Failed to destroy session:', err);
            res.status(500).send('Error logging out');
        } else {
            res.redirect('/login');
        }
    });
});

app.get('/register', (req, res) => {
    res.render('register.hbs');
});
app.post('/register', async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const sanitizedUsername = sanitize(username);
      const sanitizedEmail = sanitize(email);
  
      const user = await auth.register(sanitizedUsername, sanitizedEmail, password);
      await auth.startAuthenticatedSession(req, user);
      res.redirect('/dashboard');
    } catch (err) {
      console.error(err);
      res.render('register', { message: err.message || 'Registration error' });
    }
  });


app.get('/transactions', requireAuth, async (req, res) => {
    try {
        const userId = req.session.user._id; 
        const transactions = await Transaction.find({ userId }).lean();
        res.render('transactions', { transactions });
    } catch (error) {
        console.error("Failed to retrieve transactions:", error);
        res.status(500).send("Failed to retrieve transactions.");
    }
});

app.post('/transactions', requireAuth, async (req, res) => {
    try {
        const { type, name, category, amount, date, description } = req.body;
        const parsedDate = new Date(date + 'T00:00:00Z');
        const userId = req.session.user._id;

        const transaction = new Transaction({
            userId, 
            type: type === "−" ? "expense" : "income",
            name,
            category,
            amount: parseFloat(amount),
            date: parsedDate,
            description
        });

        await transaction.save();

        const transactions = await Transaction.find({ userId }).lean();
        res.render('transactions', { transactions });
    } catch (error) {
        console.error("Failed to add transaction:", error);
        res.status(500).send("Failed to add transaction.");
    }
});

app.delete('/deleteTransaction/:slug', requireAuth, async (req, res) => {
    try {
        const userId = req.session.user._id; 

        const transaction = await Transaction.findOneAndDelete({
            slug: req.params.slug,
            userId
        });

        if (!transaction) {
            return res.status(404).send('Transaction not found');
        }

        res.status(200).send('Transaction deleted successfully');
    } catch (error) {
        console.error('Failed to delete transaction:', error);
        res.status(500).send('Failed to delete transaction');
    }
});

app.get('/editTransaction/:id', requireAuth, async (req, res) => {
    try {
        const userId = req.session.user._id;

        const transaction = await Transaction.findOne({
            _id: req.params.id,
            userId 
        }).lean();

        if (!transaction) {
            return res.status(404).send('Transaction not found');
        }

        res.render('editTransaction', { transaction });
    } catch (error) {
        console.error('Failed to retrieve transaction for editing:', error);
        res.status(500).send('Failed to retrieve transaction');
    }
});

app.post('/editTransaction/:slug', requireAuth, async (req, res) => {
    try {
        const { type, name, category, amount, date, description } = req.body;
        const parsedDate = new Date(`${date}T00:00:00Z`);
        const userId = req.session.user._id; 

        const transaction = await Transaction.findOneAndUpdate(
            { slug: req.params.slug, userId }, 
            {
                type: type === "−" ? "expense" : "income",
                name,
                category,
                amount: parseFloat(amount),
                date: parsedDate,
                description
            },
            { new: true }
        );

        if (!transaction) {
            return res.status(404).send('Transaction not found');
        }

        res.redirect('/transactions');
    } catch (error) {
        console.error('Failed to update transaction:', error);
        res.status(500).send('Failed to update transaction');
    }
});

export default app;
app.listen(process.env.PORT);
//app.listen(3000);
