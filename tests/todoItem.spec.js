import { test, expect } from "@playwright/test";
import createDefaultTodos from "../createDefaultTodos";
import { todo } from "node:test";

test.beforeEach(async ({ page }) => {
  await page.goto("https://todomvc.com/examples/react/dist/");
  await page.getByTestId("text-input").fill("content");
  await page.getByTestId("text-input").press("Enter");
});

test.describe("Todo Item works", async () => {
  test("should allow me check to mark as completed", async ({ page }) => {
    const todoItem = page.getByTestId("todo-item");

    await expect(page.getByTestId("todo-item")).not.toHaveClass("completed");

    await expect(page.getByTestId("todo-item-toggle")).toBeVisible();
    await page.getByTestId("todo-item-toggle").click();

    await expect(todoItem).toHaveClass("completed");
  });

  test("should allow me unmark checked item", async ({ page }) => {
    const todoItem = page.getByTestId("todo-item");

    await expect(page.getByTestId("todo-item")).not.toHaveClass("completed");

    await expect(page.getByTestId("todo-item-toggle")).toBeVisible();
    await page.getByTestId("todo-item-toggle").click();

    await expect(todoItem).toHaveClass("completed");

    await page.getByTestId("todo-item-toggle").click();
    await expect(page.getByTestId("todo-item")).not.toHaveClass("completed");
  });

  test("should allow me remove todo item", async ({ page }) => {
    await createDefaultTodos(page);

    const parent = page
      .getByTestId("todo-item")
      .filter({ has: page.getByText("buy some cheese") });

    await expect(parent).toHaveAttribute("data-testid", "todo-item");

    await parent.hover();
    const closeBtn = parent.getByTestId("todo-item-button");
    await expect(closeBtn).toBeVisible();
    await closeBtn.click();

    await expect(parent).not.toBeVisible();
  });

  test("should allow me to edit todo item", async ({ page }) => {
    await createDefaultTodos(page);

    const todoItem = page
      .getByTestId("todo-item")
      .filter({ has: page.getByText("buy some cheese") });

    await todoItem.dblclick();

    const todoInput = page.getByTestId("todo-item").getByTestId("text-input");

    await expect(todoInput).toBeVisible();

    await todoInput.fill("buy some oranges");
    await todoInput.press("Enter");

    await expect(todoInput).not.toBeVisible();

    const newTodo = page
      .getByTestId("todo-item")
      .filter({ has: page.getByText("buy some oranges") });

    await expect(newTodo).toBeVisible();
  });

  test('should remove controls when edit todo input', async ({ page }) => {
    await createDefaultTodos(page);

    const todoItem = page
      .getByTestId("todo-item")
      .filter({ has: page.getByText("content") });

    const radioButton = todoItem.getByTestId("todo-item-toggle");
    const removeButton = todoItem.getByTestId("todo-item-button");

    await todoItem.hover()
    
    await expect(radioButton).toBeVisible();
    await expect(removeButton).toBeVisible();
    
    await todoItem.dblclick();

    await expect(radioButton).not.toBeVisible();
    await expect(removeButton).not.toBeVisible();
  })
});
