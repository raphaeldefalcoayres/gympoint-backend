import { startOfWeek, endOfWeek } from 'date-fns';
import { Op } from 'sequelize';
import Checkin from '../models/Checkin';

class CheckinController {
  async index(req, res) {
    const checkins = await Checkin.findAll();
    return res.json(checkins);
  }

  async store(req, res) {
    const date = new Date();
    const checkinExists = await Checkin.count({
      where: {
        id: req.params.id,
        created_at: {
          [Op.between]: [startOfWeek(date), endOfWeek(date)],
        },
      },
    });

    if (checkinExists >= 5) {
      return res
        .status(400)
        .json({ error: 'Check in is limited to 5 times a week.' });
    }

    const { id, student_id } = await Checkin.create({
      student_id: req.params.id,
    });
    return res.json({ id, student_id });
  }
}

export default new CheckinController();
