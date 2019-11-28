import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';

class HelpOrderController {
  async index(req, res) {
    const helpOrders = await HelpOrder.findAll({
      where: { answer: null },
    });
    return res.json(helpOrders);
  }

  async store(req, res) {
    const helpOrderExists = await HelpOrder.findByPk(req.params.id);

    if (!helpOrderExists) {
      return res.status(400).json({ error: 'Help Order not exist.' });
    }

    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const answer_at = new Date();

    const { answer } = req.body;

    const { id, student_id, question } = await HelpOrder.update(
      {
        answer,
        answer_at,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    return res.json({ id, student_id, question, answer, answer_at });
  }
}

export default new HelpOrderController();
