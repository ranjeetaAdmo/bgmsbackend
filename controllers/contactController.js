const contactService = require('../services/contactService');

class ContactController {
    async createContact(req, res) {
        try {
            const { name, email, phone, message } = req.body;
            const idObj = await contactService.createContact({ name, email, phone, message });
            res.status(201).json({
                success: true,
                message: "Contact saved successfully",
                data: {
                    id: idObj.id,
                    name,
                    email,
                    phone,
                    message
                }
            });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message || 'Failed to create contact' });
        }
    }

    async getContacts(req, res) {
        try {
            const contacts = await contactService.getContacts();
            res.json(contacts);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch contacts' });
        }
    }

    async getContactById(req, res) {
        try {
            const contact = await contactService.getContactById(req.params.id);
            if (!contact) return res.status(404).json({ error: 'Contact not found' });
            res.json(contact);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch contact' });
        }
    }

    async updateContact(req, res) {
        try {
            const { name, email, phone, message } = req.body;
            await contactService.updateContact(req.params.id, { name, email, phone, message });
            res.json({ message: 'Contact updated' });
        } catch (err) {
            res.status(500).json({ error: 'Failed to update contact' });
        }
    }

    async deleteContact(req, res) {
        try {
            await contactService.deleteContact(req.params.id);
            res.json({ message: 'Contact deleted' });
        } catch (err) {
            res.status(500).json({ error: 'Failed to delete contact' });
        }
    }
}

module.exports = ContactController;