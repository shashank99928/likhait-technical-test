class MakePayerNameOptionalOnExpenses < ActiveRecord::Migration[7.2]
  # payer_name is a leftover NOT NULL column from db/init.sql that the app never sets,
  # so it blocks every expense creation (including in specs). Unrelated to BUG-001 itself,
  # but required to unblock testing the fix.
  def change
    change_column_null :expenses, :payer_name, true
  end
end
