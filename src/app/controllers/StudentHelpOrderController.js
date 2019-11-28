import { startOfWeek, endOfWeek } from 'date-fns';
import { Op } from 'sequelize';
import HelpOrder from '../models/HelpOrder';

class StudentHelpOrderController {
  async index(req, res) {
    const helpOrders = await HelpOrder.findAll();
    return res.json(helpOrders);
  }

  async store(req, res) {
    const date = new Date();
    const helpOrderExists = await HelpOrder.count({
      where: {
        id: { [Op.gt]: req.params.id },
        created_at: {
          [Op.between]: [startOfWeek(date), endOfWeek(date)],
        },
      },
    });

    if (helpOrderExists >= 5) {
      return res
        .status(400)
        .json({ error: 'Check in is limited to 5 times a week.' });
    }

    const { id, student_id } = await HelpOrder.create({
      student_id: req.params.id,
    });
    return res.json({ id, student_id });
  }
}

export default new StudentHelpOrderController();
