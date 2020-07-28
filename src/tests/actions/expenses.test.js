import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import {
  addExpense,
  startAddExpense,
  editExpense,
  removeExpense,
} from "./../../actions/expenses";
import expensesTestData from "../fixtures/expenses";
import firebase from "../../firebase/firebase";

const mockStore = configureStore([thunk]);

test("should setup remove expense action object", () => {
  const action = removeExpense({ id: "testId" });
  expect(action).toEqual({ type: "REMOVE_EXPENSE", id: "testId" });
});

test("should setup edit expense action object", () => {
  const action = editExpense("testId", { note: "test note" });
  expect(action).toEqual({
    type: "EDIT_EXPENSE",
    id: "testId",
    updates: { note: "test note" },
  });
});

test("should setup add expense action object with provided values", () => {
  const action = addExpense(expensesTestData[2]);
  expect(action).toEqual({
    type: "ADD_EXPENSE",
    expense: expensesTestData[2],
  });
});

test("should add expense to database and store", (done) => {
  const store = mockStore({});
  const expenseData = {
    description: "Mouse",
    note: "",
    amount: 1950,
    createdAt: 1000,
  };
  store.dispatch(startAddExpense(expenseData)).then(() => {
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      type: "ADD_EXPENSE",
      expense: { id: expect.any(String), ...expenseData },
    });
    firebase
      .database()
      .ref(`expenses/${actions[0].expense.id}`)
      .once("value")
      .then((snapshot) => {
        expect(snapshot.val()).toEqual(expenseData);
        done();
      });
    done();
  });
});

test("should add expense with defaults data to database and store", (done) => {
  const store = mockStore({});
  const expenseDefaultData = {
    description: "",
    note: "",
    amount: 0,
    createdAt: 0,
  };
  store.dispatch(startAddExpense({})).then(() => {
    const actions = store.getActions();
    expect(actions[0]).toEqual({
      type: "ADD_EXPENSE",
      expense: { id: expect.any(String), ...expenseDefaultData },
    });
    firebase
      .database()
      .ref(`expenses/${actions[0].expense.id}`)
      .once("value")
      .then((snapshot) => {
        expect(snapshot.val()).toEqual(expenseDefaultData);
        done();
      });
    done();
  });
});

// test("should setup add expense action object with default values", () => {
//   const expenseData = {};
//   const action = addExpense(expenseData);
//   expect(action).toEqual({
//     type: "ADD_EXPENSE",
//     expense: {
//       description: "",
//       note: "",
//       amount: 0,
//       createdAt: 0,
//       id: expect.any(String),
//     },
//   });
// });
