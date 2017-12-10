import { PubSub, withFilter } from 'graphql-subscriptions';

const pubsub = new PubSub();

const contacts = [
  {
    id: '1',
    firstName: 'Manny',
    lastName: 'Henri',
    notes: [
      { 
        id: '1',
        details: 'I think this guy is an author at linkedin'
      },
      { 
        id: '2',
        details: 'His name is Manny'
      }
    ]
  },
  {
    id: '2',
    firstName: 'Jasmine',
    lastName: 'Henri-Rainville',
    notes: [
      { 
        id: '1',
        details: 'I think this guy is an author at linkedin'
      },
      { 
        id: '2',
        details: 'His name is Manny'
      }
    ]
  },
    {
    id: '3',
    firstName: 'Jeremy',
    lastName: 'Henri-Rainville',
    notes: [
      { 
        id: '1',
        details: 'I think this guy is an author at linkedin'
      },
      { 
        id: '2',
        details: 'His name is Manny'
      }
    ]
  }
]

export const resolvers = {
  Query: {
    contacts: () => {
      return contacts;
    },
    contact: (root, { id }) => {
      return contacts.find(contact => contact.id === id);
    },
  },
  Mutation: {
    addContact: (root, args) => {
      const newContact = { id: args.id, firstName: args.firstName, lastName: args.lastName, notes: [] };
      contacts.push(newContact);
      return newContact;
    },
    addNote: (root, { note }) => {
      const newId = require('crypto').randomBytes(5).toString('hex');
      const contact = contacts.find(contact => contact.id === note.contactId);
      const newNote = { id: String(newId), details: note.details };
      contact.notes.push(newNote);
      pubsub.publish('noteAdded', { noteAdded: newNote, contactId: note.contactId });
      return newNote;
    }
  },
  Subscription: {
    noteAdded: {
      subscribe: withFilter(() => pubsub.asyncIterator('noteAdded'), (payload, variables) => {
        return payload.contactId === variables.contactId;
      }),
    }
  },
};
