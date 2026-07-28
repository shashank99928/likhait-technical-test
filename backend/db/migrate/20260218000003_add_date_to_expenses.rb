class AddDateToExpenses < ActiveRecord::Migration[7.2]
  # `create_table if_not_exists: true` in the original migration silently no-ops
  # against the pre-existing table from db/init.sql, so `date` never actually got created.
  def up
    add_column :expenses, :date, :date unless column_exists?(:expenses, :date)
    # Backfill existing rows so `date` can be NOT NULL without losing data.
    execute "UPDATE expenses SET date = DATE(created_at) WHERE date IS NULL"
    change_column_null :expenses, :date, false
  end

  def down
    remove_column :expenses, :date
  end
end
