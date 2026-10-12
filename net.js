// Подключение Firebase SDK (модули с CDN, сборка проекту не нужна).
// Версию меняйте в одном месте — константа V.
import { firebaseConfig } from './firebase-config.js';

const V = '12.19.0';
const base = `https://www.gstatic.com/firebasejs/${V}`;

try {
    const [appMod, authMod, dbMod, fsMod] = await Promise.all([
        import(`${base}/firebase-app.js`),
        import(`${base}/firebase-auth.js`),
        import(`${base}/firebase-database.js`),
        import(`${base}/firebase-firestore.js`)
    ]);
    const sdk = {
        initializeApp: appMod.initializeApp,
        getAuth: authMod.getAuth,
        onAuthStateChanged: authMod.onAuthStateChanged,
        createUserWithEmailAndPassword: authMod.createUserWithEmailAndPassword,
        signInWithEmailAndPassword: authMod.signInWithEmailAndPassword,
        signInAnonymously: authMod.signInAnonymously,
        signOut: authMod.signOut,
        updateProfile: authMod.updateProfile,
        getDatabase: dbMod.getDatabase,
        ref: dbMod.ref,
        get: dbMod.get,
        set: dbMod.set,
        update: dbMod.update,
        remove: dbMod.remove,
        onValue: dbMod.onValue,
        runTransaction: dbMod.runTransaction,
        onDisconnect: dbMod.onDisconnect,
        serverTimestamp: dbMod.serverTimestamp,
        getFirestore: fsMod.getFirestore,
        doc: fsMod.doc,
        getDoc: fsMod.getDoc,
        setDoc: fsMod.setDoc
    };
    window.Net = window.createNet(sdk, firebaseConfig);
    window.dispatchEvent(new Event('net-ready'));
} catch (e) {
    console.error('Firebase не загрузился:', e);
    window.NetError = e;
    window.dispatchEvent(new Event('net-error'));
}
