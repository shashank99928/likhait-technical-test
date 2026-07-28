require 'rails_helper'

RSpec.describe Expense, type: :model do
  it "is invalid with a future date" do
    category = Category.create!(name: "Food")
    expense = Expense.new(description: "Lunch", amount: 10.00, category: category, date: 1.day.from_now.to_date)

    expect(expense).not_to be_valid
    expect(expense.errors[:date]).to include("can't be in the future")
  end
end
