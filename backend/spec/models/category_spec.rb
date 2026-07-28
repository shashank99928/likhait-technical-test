require 'rails_helper'

RSpec.describe Category, type: :model do
  it "is invalid with a duplicate name" do
    Category.create!(name: "Food")
    duplicate = Category.new(name: "Food")

    expect(duplicate).not_to be_valid
    expect(duplicate.errors[:name]).to include("has already been taken")
  end
end
