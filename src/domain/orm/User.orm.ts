import pool from "../../db";
export const userFindByEmail = async (email: string) => {
  try {
    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    return {
      user: user.rows[0],
    };
  } catch (error) {
    return {
      error: `Se produjo un error ${error}`,
    };
  }
};
