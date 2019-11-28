import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

class StudentHelpOrderController {
  async show(req, res) {
    const studentExits = await Student.findByPk(req.params.id);

    if (!studentExits) {
      return res.status(400).json({ error: 'Student not exist.' });
    }

    const helpOrders = await HelpOrder.findAll({
      where: {
        student_id: req.params.id,
      },
    });

    return res.json(helpOrders);
  }

  async store(req, res) {
    const studentExits = await Student.findByPk(req.params.id);

    if (!studentExits) {
      return res.status(400).json({ error: 'Student not exist.' });
    }

    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const data = req.body;
    data.student_id = req.params.id;

    const { id, student_id, question } = await HelpOrder.create(data);
    return res.json({ id, student_id, question });
  }
}

export default new StudentHelpOrderController();
