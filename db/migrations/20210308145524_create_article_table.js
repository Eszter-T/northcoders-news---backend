exports.up = function (knex) {
  console.log("creating articles table");
  return knex.schema.createTable("articles", (articleTable) => {
    articleTable.increments("article_id").primary();
    articleTable.string("title").notNullable();
    articleTable.string("body").notNullable();
    articleTable.integer("votes").defaultTo(0);
    articleTable.string("topic").references("slug");
    articleTable.string("author").references("username");
    articleTable.timestamp("created_at");
  });
};

exports.down = function (knex) {
  console.log("dropping articles table");
  return knex.schema.dropTable("articles");
};
